import LoginForm from '@/components/elements/frontPage/LoginForm';

export default function FrontPage(props) {
  return (
	<div className='container_main_bg'>
		<div className='container'>
			<div className='row'>
				<LoginForm {...props}/>
			</div>
		</div>
	</div>
    );
}
